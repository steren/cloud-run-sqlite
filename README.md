# cloud-run-sqlite


## Start locally:

```
npm install
npm start
```

Optionally, you can re-populate the database with

```
npm run populate
```

## Deploy server to Cloud Run

```
export PROJECT_ID="steren-playground"
export REGION="us-central1"
export SERVICE="cloud-run-sqlite"

export BUCKET_NAME="$PROJECT_ID-data"

# Create Storage bucket
gcloud storage buckets create gs://$BUCKET_NAME --location=$REGION --project $PROJECT_ID

# Upload database
gcloud storage cp ./data/books.db gs://$BUCKET_NAME --project $PROJECT_ID

gcloud run deploy $SERVICE --region $REGION --project $PROJECT_ID \
--source . \
--allow-unauthenticated \
--update-env-vars DB_PATH="/data" \
--add-volume name=gcs,type=cloud-storage,bucket=$BUCKET_NAME \
--add-volume-mount volume=gcs,mount-path=/data
```