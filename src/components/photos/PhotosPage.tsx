import { useEffect, useState } from "react";
import { Image, Loader2, AlertCircle, Plus } from "lucide-react";

// Add GIS to window type
declare global {
    interface Window {
        google?: any;
    }
}

interface SelectedPhoto {
    id: string;
    baseUrl: string;
    filename: string;
}

interface PhotosPageProps {
    darkMode?: boolean;
}

const PhotosPage: React.FC<PhotosPageProps> = ({ darkMode = false }) => {

    // ===== STATE =====
    const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // ===== GOOGLE CONFIG =====
    const CLIENT_ID = "618324923698-52v78kdn7ja29e7kiav053l7m7g280f1.apps.googleusercontent.com";
    const SCOPES = "https://www.googleapis.com/auth/drive";
    const API_KEY = "AIzaSyCZ0WXPDTP3GGcRc1BwUSic12pACs7vJdk";

    // Load GIS script on mount
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const stored = localStorage.getItem("google_access_token");
        if (stored) {
            setAccessToken(stored);
            setIsAuthenticated(true);
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const script1 = document.createElement("script");
        script1.src = "https://accounts.google.com/gsi/client";
        script1.async = true;
        document.body.appendChild(script1);

        const script2 = document.createElement("script");
        script2.src = "https://apis.google.com/js/api.js";
        script2.async = true;
        document.body.appendChild(script2);

        script2.onload = () => {
            window.gapi.load("picker", () => console.log("Picker loaded"));
        };
    }, []);

    const openPhotoPicker = () => {
        if (!accessToken) {
            setError("You must sign in first.");
            return;
        }

        const view = new window.google.picker.DocsView(
            window.google.picker.ViewId.PHOTOS
        ).setIncludeFolders(true);

        const picker = new window.google.picker.PickerBuilder()
            .setAppId(CLIENT_ID)
            .setOAuthToken(accessToken)
            .setDeveloperKey(API_KEY)
            .addView(view)
            .setCallback((data: any) => {
                if (data.action === window.google.picker.Action.PICKED) {
                    const picked = data.docs.map((doc: any) => ({
                        id: doc.id,
                        baseUrl: doc.thumbnails[0].url,
                        filename: doc.name
                    }));
                    setPhotos((prev) => [...prev, ...picked]);
                }
            })
            .build();

        picker.setVisible(true);
    };



    // ========== AUTH ==========

    const handleSignIn = () => {
        if (!window.google?.accounts?.oauth2) {
            setError("Google Services not loaded yet. Try again.");
            return;
        }

        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (resp: any) => {
                if (resp.error) {
                    setError(resp.error);
                    return;
                }

                if (resp.access_token) {
                    localStorage.setItem("google_access_token", resp.access_token);
                    setAccessToken(resp.access_token);
                    setIsAuthenticated(true);
                    setError(null);
                }
            }
        });

        client.requestAccessToken();
    };

    const handleSignOut = () => {
        localStorage.removeItem("google_access_token");
        setIsAuthenticated(false);
        setAccessToken(null);
        setPhotos([]);
    };

    // ========== FETCH PHOTOS ==========

    //   const loadGooglePhotos = async () => {
    //     if (!accessToken) {
    //       setError("You must sign in first.");
    //       return;
    //     }

    //     try {
    //       setLoading(true);
    //       setError(null);

    //       const res = await fetch(
    //         "https://photoslibrary.googleapis.com/v1/mediaItems:search",
    //         {
    //           method: "POST",
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             "Content-Type": "application/json"
    //           },
    //           body: JSON.stringify({
    //             pageSize: 50
    //           })
    //         }
    //       );

    //       const data = await res.json();

    //       if (data.error) {
    //         setError(data.error.message || "Failed to load photos");
    //         return;
    //       }

    //       if (!data.mediaItems) {
    //         setError("No photos found in your Google Photos library.");
    //         return;
    //       }

    //       const items: SelectedPhoto[] = data.mediaItems.map((item: any) => ({
    //         id: item.id,
    //         baseUrl: item.baseUrl,
    //         filename: item.filename
    //       }));

    //       setPhotos(items);
    //     } catch (err) {
    //       setError("Failed to fetch photos.");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    // ========== UI ==========

    if (!isAuthenticated) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center p-4 ${darkMode
                        ? "bg-gray-900"
                        : "bg-gradient-to-br from-blue-50 to-indigo-100"
                    }`}
            >
                <div
                    className={`rounded-lg shadow-xl p-8 max-w-md w-full text-center ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? "bg-gray-700" : "bg-blue-100"
                            }`}
                    >
                        <Image
                            className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                        />
                    </div>

                    <h1
                        className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Google Photos Viewer
                    </h1>
                    <p
                        className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Sign in to view your Google Photos
                    </p>

                    {error && (
                        <div
                            className={`border rounded-lg p-4 mb-4 ${darkMode
                                    ? "bg-red-900/30 border-red-700"
                                    : "bg-red-50 border-red-200"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-red-300" : "text-red-800"
                                    }`}
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleSignIn}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    // ===== AUTHENTICATED VIEW =====

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <div
                className={`shadow-sm border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1
                        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        My Google Photos
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSignOut}
                            className={`font-medium py-2 px-4 rounded-lg ${darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                }`}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {error && (
                    <div
                        className={`border rounded-lg p-4 mb-6 flex items-start ${darkMode
                                ? "bg-red-900/30 border-red-700"
                                : "bg-red-50 border-red-200"
                            }`}
                    >
                        <AlertCircle
                            className={`w-5 h-5 mt-0.5 mr-3 ${darkMode ? "text-red-400" : "text-red-600"
                                }`}
                        />
                        <p className={`${darkMode ? "text-red-300" : "text-red-800"}`}>
                            {error}
                        </p>
                    </div>
                )}

                <div className="mb-6">
                    <button
                        onClick={openPhotoPicker}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                    >
                        <Plus size={20} />
                        Pick Photos from Google
                    </button>

                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader2
                            className={`w-8 h-8 animate-spin ${darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                        />
                    </div>
                )}

                {!loading && photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((p) => (
                            <div
                                key={p.id}
                                className={`relative aspect-square rounded-lg overflow-hidden shadow-sm ${darkMode ? "bg-gray-800" : "bg-gray-200"
                                    }`}
                            >
                                <img
                                    src={`${p.baseUrl}=w400-h400`}
                                    alt={p.filename}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && photos.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Image
                            className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                        />
                        <p
                            className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            No photos loaded yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotosPage;
