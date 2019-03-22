FROM tensorflow/tensorflow as tensorflow_angular

RUN apt-get update && apt-get -y install gnupg2

RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_9.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

RUN nodejs -v
RUN npm -v

# Set working directory
RUN mkdir /usr/share/app
WORKDIR /usr/share/app

# Install Angular CLI
RUN npm install -g @angular/cli@7.0.6

# Install App pacakges
COPY package*.json /usr/share/app/
RUN ls -la
RUN npm i
