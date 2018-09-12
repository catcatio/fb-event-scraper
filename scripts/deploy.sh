ssh root@catcat.io "mkdir -p ~/fb-event-scraper"
rsync -Praz --exclude=node_modules --exclude=.git ../ root@catcat.io:~/fb-event-scraper