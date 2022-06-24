<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/team-irc/tchatong">
    <img src="images/logo.png" alt="Logo" width="400" height="200">
  </a>

<h3 align="center">트위치 채팅 통계 서비스</h3>

  <p align="center">
    <a href="https://tchatong.info">Goto Service</a>
    ·
    <a href="https://github.com/team-irc/tchatong/issues">Report Bug</a>
    ·
    <a href="https://github.com/team-irc/tchatong/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#start">Start</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://tchatong.info)
![server](https://github.com/team-irc/tchatong/blob/main/images/server.png)

트채통은 인터넷 방송 플랫폼 "트위치"의 채팅로그를 분석, 시각화하여 보여주는 서비스 입니다.  

트채통은 Twitch에서 운영하는 사이트가 아닙니다.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Big Query](https://img.shields.io/badge/bigquery-%234285F4.svg?style=for-the-badge&logo=bigquery&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23E34F26.svg?style=for-the-badge&logo=grafana&logoColor=white)
![InfluxDB](https://img.shields.io/badge/influxdb-%23323330.svg?style=for-the-badge&logo=influxdb&logoColor=blue)
![Telegraf](https://img.shields.io/badge/telegraf-%23323330.svg?style=for-the-badge&logo=telegraf&logoColor=blue)
![PhpMyAdmin](https://img.shields.io/badge/phpmyadmin-FE7A16.svg?style=for-the-badge&logo=phpmyadmin&logoColor=white)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

아래에서는 로컬에서 프로젝트를 실행하는 방법을 설명합니다.

### Prerequisites

다음과 같은 프로그램이 설치되어 있어야 합니다.
* Docker
* Docker Compose

### Start

1. 프로젝트를 클론 받습니다.
   ```sh
    git clone https://github.com/team-irc/tchatong
   ```
2. 프로젝트의 루트에 `docker.env`라는 파일을 만들고 아래의 내용을 채웁니다.
   ```dotenv
    # redis
    REDIS_HOST=YOUR_REDIS_HOST
    REDIS_PORT=YOUR_REDIS_PORT
    
    # mariaDB
    DB_HOST=YOUR_DB_HOST
    DB_USER=YOUR_DB_USER
    DB_PASSWORD=YOUR_DB_PASSWORD
    DB_NAME=YOUR_DB_NAME
    
    # google big query
    GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID
    GOOGLE_DATASET_ID=YOUR_GOOGLE_DATASET_ID
    GOOGLE_TABLE_ID=YOUR_GOOGLE_TABLE_ID
    GOOGLE_APPLICATION_CREDENTIALS=/backend/key_name.json
    
    # twitch chat bot
    TWITCH_ID=YOUR_TWITCH_IRC_ID
    TWITCH_PW=YOUR_TWITCH_IRC_PASSWORD
    
    # twitch api
    TWITCH_API_CLIENT_ID=YOUR_TWITCH_API_CLIENT_ID
    TWITCH_API_CLIENT_SECRET=YOUR_TWITCH_API_CLIENT_SECRET
    TWITCH_API_ACCESS_TOKEN=YOUR_TWITCH_API_ACCESS_TOKEN
    
    # influxDB
    INFLUXDB_DB=YOUR_INFLUXDB_NAME
    INFLUXDB_USER=YOUR_INFLUXDB_USER
    INFLUXDB_ADMIN_ENABLED=true
    INFLUXDB_ADMIN_USER=YOUR_INFLUXDB_ADMIN_USER
    INFLUXDB_ADMIN_PASSWORD=YOUR_INFLUXDB_ADMIN_PASSWORD
    
    # grafana
    GRAFANA_ADMIN=YOUR_GRAFANA_ADMIN
    GRAFANA_ADMIN_PASSWORD=YOUR_GRAFANA_ADMIN_PASSWORD
    
    # phpmyadmin
    PMA_HOST=YOUR_PMA_HOST
    PMA_PORT=YOUR_PMA_PORT
    PMA_ARBITRARY=YOUR_PMA_ARBITRARY
    PMA_ABSOLUTE_URI=YOUR_PMA_ABSOLUTE_URI
   ```
3. app/db/srcs 폴더에 init_db.sql 파일을 생성하고 내용을 채웁니다.
   ```sql
    FLUSH PRIVILEGES;
    CREATE DATABASE YOUR_DB_NAME;
    CREATE USER YOUR_USER_NAME'%' IDENTIFIED BY 'YOUR_PASSWORD';
    GRANT ALL ON *.* to YOUR_USER_NAME'%' IDENTIFIED BY 'YOUR_PASSWORD';
    FLUSH PRIVILEGES;
   ```
4. app/backend 폴더에 Google Big Query Key를 넣습니다.
5. 컨테이너를 실행시킵니다.
   ```sh
   docker-compose up --build
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE.txt`를 확인해주세요.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

AMATEURTOSS - amateur.toss@gmail.com  
HanGyeolN - ghnruf@gmail.com  

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/team-irc/tchatong.svg?style=for-the-badge
[contributors-url]: https://github.com/team-irc/tchatong/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/team-irc/tchatong.svg?style=for-the-badge
[forks-url]: https://github.com/team-irc/tchatong/network/members
[stars-shield]: https://img.shields.io/github/stars/team-irc/tchatong.svg?style=for-the-badge
[stars-url]: https://github.com/team-irc/tchatong/stargazers
[issues-shield]: https://img.shields.io/github/issues/team-irc/tchatong.svg?style=for-the-badge
[issues-url]: https://github.com/team-irc/tchatong/issues
[license-shield]: https://img.shields.io/github/license/team-irc/tchatong.svg?style=for-the-badge
[license-url]: https://github.com/team-irc/tchatong/blob/develop/LICENSE.txt
[product-screenshot]: images/screenshot.png
