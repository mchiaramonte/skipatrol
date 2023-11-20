# SkiPatrol

Angular app built for displaying local skiing conditions for a friend. This is running on a Raspberry Pi mounted on a 10" touch display. Working on polling data from the relevant ski resorts. Still a work in progress.

The code is pushed to the pi via a docker image that gets built manually right now. That'll become an automated build soon.

## Build Docker Image

In order for this to run properly on a Raspberry Pi, be sure to build it with the correct platform settings

```docker buildx build --platform linux/amd64,linux/arm/v8 -t clearvus/ski-patrol .```
