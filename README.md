# Backgammon Social Site

This project is a web application for playing backgammon online, allowing two players or a player against an intelligent agent (bot) to compete. The platform also enables tournament organization among players and features a leaderboard updated with personal scores.

## Table of Contents
- [Introduction](#introduction)
- [Project Features](#project-features)
- [Team Roles](#team-roles)
- [Working Methodology](#working-methodology)
- [Architecture and Technologies](#architecture-and-technologies)
- [Installation Instructions](#installation-instructions)
- [Contributions and Conventions](#contributions-and-conventions)

## Introduction
Sprint Zero was essential for planning the project, outlining the main features, establishing communication foundations, and structuring the backlog of user stories necessary for the development sprints.

## Project Features
- **Online Play**: Compete in backgammon online against other users or an intelligent agent.
- **Tournaments**: Organize and participate in tournaments with up to four players.
- **Leaderboard**: Updated ranking based on personal ratings.
- **User Interface**: Simple and intuitive UI designed for an optimal gaming experience.
- **Communication**: Notifications and messaging for tournaments and challenges.

## Team Roles
- **Scrum Master**: Cristian Orsi
- **Product Owner**: Enis Brajevic
- **Developer 1**: Matteo Fornaini
- **Developer 2**: Mattia Ferrarini
- **Developer 3**: Enrico Mazzotti
- **Developer 4**: Lorenzo Giarrusso

## Working Methodology
The team works five days a week, with flexible hours for each member. Communication occurs via Mattermost for messaging and Microsoft Teams for video calls, while English is the primary language for code and technical documentation.

## Architecture and Technologies
The project is divided into three main components:
- **Frontend**: Developed in Vue.js.
- **Backend**: Developed in Python using FastAPI.
- **Database**: Manages data for users, tournaments, and rankings.

### Docker
The project utilizes a multi-stage Dockerfile for container management:
- **Frontend Stage**: Builds the Vue app to generate static files.
- **Backend Stage**: Configures and runs the Python application, serving the static frontend files and managing APIs.

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://aminsep.disi.unibo.it/gitlab/swe-team-3/backgammon-social-site.git
   cd backgammon-social-site
   ```

2. Create and start the Docker containers:
   ```bash
   docker compose up --build
   ```

3. Access the app: The application will be available at `http://localhost:8080`.

## Contributions and Conventions

- **Language**: English for code and documentation.
- **Versioning**:
  - Branching workflow: Use prefixes (`feature/`, `bugfix/`, `docs/`).
  - Branch naming: Lowercase, separated by hyphens (e.g., `feature/game-board`).
  - Commit messages: In imperative form (e.g., `Add login endpoint`).
  - Merging to main: Requires positive review from another team member.
