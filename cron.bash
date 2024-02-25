cd /home/ubuntu/lost-weapons
docker-compose restart scripts > /dev/null 2>&1 && echo "DB scripts have been restarted!"
sleep 60
aws cloudfront create-invalidation --distribution-id $(aws cloudfront list-distributions --query 'DistributionList.Items[0].Id' --output text) --paths "/*" > /dev/null 2>&1 && echo "Cache has been cleared!"