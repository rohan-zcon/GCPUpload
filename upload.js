const gbfs = require('./gbfs.json');
const {Storage} = require('@google-cloud/storage');
const fetch = require('node-fetch');

async function upload() {
	try {
		// [START storage_upload_without_authentication_signed_url]
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
		// Use signed URLs to manually start resumable uploads.
		// Authenticating is required to get the signed URL, but isn't
		// required to start the resumable upload
		const options = {
			version: 'v4',
			action: 'resumable',
			expires: Date.now() + 30 * 60 * 1000 // 30 mins
		};
		console.log('---options----', options);
		//auth required
		const [signedUrl] = await file.getSignedUrl(options);
		console.log('---signedUrl----', signedUrl);
		// no auth required
		const resumableSession = await fetch(signedUrl, {
			method: 'POST',
			headers: {
				'x-goog-resumable': 'start'
			}
		});
		console.log('---resumableSession----', resumableSession);
		// Endpoint to which we should upload the file
		const location = resumableSession.headers.location;

		// Passes the location to file.save so you don't need to
		// authenticate this call
		await file.save(contents, {
			uri: location,
			resumable: true,
			validation: false
		});

		console.log(`${destFileName} uploaded to ${bucketName}`);
	} catch (error) {
		console.log(error);
	}

	// [END storage_upload_without_authentication_signed_url]
}

// main(...process.argv.slice(2));

module.exports = upload;
