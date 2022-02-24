# Streaming Service

The streaming service manages RTSP streams for each gate. For each camera, it starts an `ffmpeg` process that writes an image from the stream every second. The service can be asked to save a snapshot, it then creates a directory with the current image, along with 20 images before and after. The service also handles deleting old snapshots and restarting the `ffmpeg` processes if they die or stop writing images.

All images are written to the `$GK_DATA_PATH` directory (default is `/data` using Docker). Live images are written to `camera_<id>/live/<timestamp>.jpg` and saved snapshots to `camera_<id>/snapshots/<timestamp>/`. Each saved snapshot directory contains a sequence of about 40 images, 20 before and after the snapshot timestamp.

To see all the capabilities, see the endpoints section.

## Development

First create a virtual environment and install the required packages

    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt

You can then start the service with auto-reloading

    gunicorn --reload app:app

The service can also be built as a Docker image.

    docker build .

## Endpoints

**GET /**

Returns statistics for all streams.

    [
        {
            cpu_percent:    CPU usage of the fmpeg process (percent)
            created_at:     Creation time of the ffmpeg process
            disk_size:      Size of snapshots on disk (bytes)
            id:             Stream ID
            is_alive:       ffmpeg process alive and writing images
            latest_image:   Latest image from stream
            memory:         ffmpeg memory usage (bytes)
            pid:            ffmpeg process ID
            uptime:         ffmpeg process uptime in seconds
            url:            Stream URL
        }
    ]

**GET /save/<stream_id>**

Requests that the service saves a snapshot.

Returns the timestamp of the snapshot.

    {
        image:      Timestamp of snapshot
    }

**GET /remove_old_snapshots/<timestamp>**

Removes all saved snapshots older than timestamp.

**GET /latest_snapshots/<stream_id>**

Returns the most recent snapshots taken, including the first and last image in the sequence (up to +/- 20 seconds)

    [
        {
            snapshot:       Timestamp of snapshot
            first_image:    Timestamp of first image in sequence
            last_image:     Timestamp of last image in sequence
        }
    ]

**GET /latest_image/<stream_id>**

Returns an auto-refreshing live image from the stream. For debug purposes only.

**POST /config**

Update the service configuration. The config is saved to `$GK_DATA_PATH/config.json`.

The POST body should have the following format.

    [
        {
            id:         Stream ID
            url:        RTSP stream URL
        }
    ]