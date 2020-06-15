## BASEADO em [serverless-architecture-boilerplate by msfidelis](https://github.com/msfidelis/serverless-architecture-boilerplate)

### Dev Plugins

This boilerplate contains following plugins for local development:
* [serverless](https://www.serverless.com/)
* [serverless-offline](https://github.com/dherault/serverless-offline) - For run API Gateway local and manage plugins
* [serverless-offline-scheduler](https://github.com/ajmath/serverless-offline-scheduler) - CloudWatch Schedule Adapter
* [serverless-offline-sqs-esmq](https://github.com/msfidelis/serverless-offline-sqs-esmq) - SQS Adapter
* [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local/releases) - DynamoDB Adapter
* [serverless-plugin-split-stacks](https://github.com/dougmoscrop/serverless-plugin-split-stacks) - Split Cloudformation Templates


###Structure
```
configs/dev.yml
configs/local.yml
configs/prod.yml
handlers/endpoints.yml
handlers/workers.yml
src/endpoints/books.js
src/endpoints/book/create.js
src/endpoints/book/delete.js
src/endpoints/book/read.js
src/endpoints/book/update.js
src/util/dynamo.js
SRC/util/kinesis.js
SRC/util/lambda.js
SRC/util/parsers.js
src/util/response.js
src/util/sqs.js
src/util/uuid.js
src/worker/books/handler.js
```

## Manage AWS Cloudformation with Serverless

### IAM Roles

[IAM Docs](https://serverless.com/framework/docs/providers/aws/guide/iam/)

```yml
  iamRoleStatements: # Permissions for all of your functions can be set here

  - Effect: Allow
    Action: # Gives permission to DynamoDB tables in a specific region
      - dynamodb:DescribeTable
      - dynamodb:Query
      - dynamodb:Scan
      - dynamodb:GetItem
      - dynamodb:PutItem
      - dynamodb:UpdateItem
      - dynamodb:DeleteItem
    Resource: "arn:aws:dynamodb:us-east-1:*:*"

  - Effect: Allow
    Action: # Gives permission to Lambda execution
      - lambda:InvokeFunction
      - lambda:InvokeAsync
    Resource: "*"
```

### Manage Infrastructure Components - [Docs](https://serverless.com/framework/docs/providers/aws/guide/resources/#aws-cloudformation-resource-reference)

```yml
# Infrastrucure - Cloud Formation
resources:  # CloudFormation template syntax

  Resources:
    #DynamoDB Books Table
    BooksCatalog:
      Type: AWS::DynamoDB::Table # CloudFormation Pseudo Parameter Example
      Properties:
        TableName: ${self:custom.dynamo-books}
        AttributeDefinitions:
          - AttributeName: hashkey
            AttributeType: S
        KeySchema:
          - AttributeName: hashkey
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 2
          WriteCapacityUnits: 1

    # SQS Queue to Update DynamoDB
    BooksQueueExample:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:custom.sqs-logs}
        MessageRetentionPeriod: 1209600
        VisibilityTimeout: 60
```

## Functions

### HTTP Trigger Function (API Gateway)

- handlers/endpoints.yml

```yml
functions:

  # API Endpoints
  books-register:
    handler: src/endpoints/books.handler
    memorySize: 128  # Lambda Memory Limit
    timeout: 60 # Lambda Timeout
    events:
      - http: # HTTP Trigger
          path: v1/books # API Endpoint
          method: post # HTTP Method
      - http:
          path: v1/books
          method: get
      - http:
          path: v1/books/{hashkey}
          method: get
      - http:
          path: v1/books/{hashkey}
          method: put
      - http:
          path: v1/books/{hashkey}
          method: delete

```
- handlers/workers.yml

### Cloudwatch Events Functions (Cron)

[Lambda Schedule Docs](https://serverless.com/framework/docs/providers/aws/events/schedule/)

```yml
# Background Function
  books-consumer:
    handler: src/worker/books/handler.worker #Path to function
    events:
      - schedule: #Cloudwatch Event Trigger
        rate: cron(* * * * * *) # Cron Syntax
        enabled: true # Trigger Enabled

```

## Development environment

This boilerplate uses `serverless-local` plugin and some containers and plugins to emulate the AWS Resources

```bash
docker-compose up
```
or (background)
```bash
docker-compose up -d
```
The applications will start on `http://localhost:3000`

**List books**
```bash
curl -X GET \
    http://localhost:3000/v1/books
```
**Create book**
```bash
curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"title": "American Gods", "author": "Neil Gaiman", "price": 10.00  }' \
    http://localhost:3000/v1/books -i
```

## Production environment

### Deploy full services

#### run command into container ####
```bash
docker exec -it <container_id_or_name> echo "I'm inside the container!"
```
ex. login serverless -> aws (credential in .env)
```bash
docker exec -it serverless-example_serverless_1 npm run login
```
deploy dev
```bash
docker exec -it serverless-example_serverless_1 npm run dev
```
deploy prod
```bash
docker exec -it serverless-example_serverless_1 npm run prod
```

[![asciicast](https://asciinema.org/a/4mzSihwWksZvjx7KO6mUy3EmO.png)](https://asciinema.org/a/4mzSihwWksZvjx7KO6mUy3EmO)


### Deploy a function

```bash
serverless deploy function -f books-consumer
```

### Clean All

```bash
serverless remove
```

## Testing

**Create Book**

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"title": "American Gods", "author": "Neil Gaiman", "price": 10.00  }' \
    https://yur25zhqo0.execute-api.us-east-1.amazonaws.com/production/services/books -i
```

**List Books**
```bash
curl -X GET \
    https://yur25zhqo0.execute-api.us-east-1.amazonaws.com/production/services/books
```


**Detail Book**

```bash
curl -X GET \
    https://yur25zhqo0.execute-api.us-east-1.amazonaws.com/production/services/books/456c9e8f-6c50-d656-dc69-dc828c42af65
```

**Delete Book**

```bash
curl -X DELETE \
    https://yur25zhqo0.execute-api.us-east-1.amazonaws.com/production/services/books/456c9e8f-6c50-d656-dc69-dc828c42af65 -i
```

**Update Book**

```bash
curl -X PUT \
    -d '{"title": "updated modafoca"}' -H "Content-type: application/json" \
    https://eusrv4mci5.execute-api.us-east-1.amazonaws.com/production/services/books/bbafdb0c-ee6e-fca0-f224-ed534f5b7766 -i
```
