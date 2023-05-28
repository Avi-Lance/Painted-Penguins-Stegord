FROM public.ecr.aws/lambda/python:3.10

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY requirements.txt  .
RUN  \
  apk add --no-cache postgresql-libs && \
  apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}" && \
  apk --purge del .build-deps

# Copy function code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "lambda_function.lambda_handler" ]
