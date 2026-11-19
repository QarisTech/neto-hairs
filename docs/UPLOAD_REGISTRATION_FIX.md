# Cloudinary video registration update
The upload can complete at Cloudinary before library registration fails. Registration now requests media_metadata=true and checks both duration and video.duration from the authenticated provider response. It retains signature, asset identity, version, type, format, size and duration checks. Missing provider metadata, excessive duration/size and identity mismatch produce separate messages; client-supplied metadata never substitutes for provider verification.

Deploy this update through the GitHub-connected Netlify site. In the same browser used for the original upload, open Photos & videos and click Finish saving uploaded file if available. Upload tickets expire after one hour; expired tickets require selecting/uploading the file again. The update does not import arbitrary Cloudinary files or delete any existing asset.

27 backend tests pass, including a simulated 49.28 MiB MP4 with 24.1-second nested provider duration. The actual owner's Cloudinary API response and production upload have not been verified.
