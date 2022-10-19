const gbfs = require('./gbfs.json');
const {Storage} = require('@google-cloud/storage');
const fetch = require('node-fetch');

async function uploadWOAuth() {
	try {
		// [START storage_upload_without_authentication]
		/**
		 * TODO(developer): Uncomment the following lines before running the sample.
		 */
		// The ID of your GCS bucket
		const bucketName = process.env.BUCKET_NAME;

		// The contents that you want to upload
		const contents = gbfs;

		// The new ID for your GCS file
		const destFileName = 'gbfs-test.json';

		// Creates a client
		const storage = new Storage();

		const file = storage.bucket(bucketName).file(destFileName);
		console.log('---file----', file);
		// Returns an authenticated endpoint to which
		// you can make requests without credentials.
		const [location] = await file.createResumableUpload(); //auth required

		const options = {
			uri: location,
			resumable: true,
			validation: false,

			// Optional:
			// Set a generation-match precondition to avoid potential race conditions
			// and data corruptions. The request to upload is aborted if the object's
			// generation number does not match your precondition. For a destination
			// object that does not yet exist, set the ifGenerationMatch precondition to 0
			// If the destination object already exists in your bucket, set instead a
			// generation-match precondition using its generation number.
			preconditionOpts: {ifGenerationMatch: generationMatchPrecondition}
		};

		// Passes the location to file.save so you don't need to
		// authenticate this call
		await file.save(contents, options);

		console.log(`${destFileName} uploaded to ${bucketName}`);
	} catch (error) {
		console.log(error);
	}
}

module.exports = uploadWOAuth;
