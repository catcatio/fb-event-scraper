#!/bin/bash
ssh root@catcat.io "cd ~/fb-event-scraper/ && docker-compose down && docker-compose up --build -d"