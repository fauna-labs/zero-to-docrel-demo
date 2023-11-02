* Install packages: `npm install`
* Add a file `.env.json` with the following contents:
  ```
  {
    "AWS_PROFILE": "<a profile in your ~/.aws/credentials file with the proper permissions e.g. default>",
    "AWS_REGION": "<the AWS region, e.g. us-west-2>",
    "ENVIRONMENT": "<the environment e.g. dev>",
    "FAUNA_API_KEY": ""
  }
  ```
* To run locally, use `serverless-offline`
  ```
  sls offline
  ```