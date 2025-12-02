import './HomePage.css';
import BrandName from './brandname/BrandName';
import { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineMailOpen } from "react-icons/hi";

function HomePage({ darkMode }: { darkMode: boolean }) {

  const [isEmailHovered, setIsEmailHovered] = useState(false);

  return (
    <div className="home-container">
      <div className="brand-and-social">
        <div className="brand-name-group">
          <img
            src="https://media.licdn.com/dms/image/v2/C4E03AQF5Rm5ONbgHFQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1602294599941?e=1765411200&v=beta&t=2V4q9GXpzSh5iTLYDpr0cyvOa-b8HbJe7lPeq6xvn1s"
            alt="Kevin Lee"
            className="profile-photo"
            onError={(e) => {
              e.currentTarget.style.display = 'none'; /* Hides image if it fails to load */
            }}
          />
          <BrandName />
        </div>
        <div className="social-links">
          <a
          href="mailto:kxuanyonglee@gmail.com"
          className={`email-link ${darkMode ? 'dark' : ''}`}
          onMouseEnter={() => setIsEmailHovered(true)}
          onMouseLeave={() => setIsEmailHovered(false)}
          >
            {isEmailHovered ? <HiOutlineMailOpen /> : <HiOutlineMail />}
          </a>
          <a
            href="https://www.linkedin.com/in/kevin-lee-x/"
            target="_blank" /* Opens link in new tab */
            rel="noopener noreferrer" /* Security best practice for external links */
            className={`linkedin-link ${darkMode ? 'dark' : ''}`}
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}
export default HomePage