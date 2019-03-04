FROM tensorflow/tensorflow as node-angular-cli

# Linux setup
#RUN apk update \
#  && apk add --update alpine-sdk \
#  && apk del alpine-sdk \
#  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
#  && npm cache verify \
#  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

# install npm
#RUN $NVM_DIR/nvm.sh \
#  && nvm install --lts \
#  && nvm alias default lts/* \
#  && nvm use default

RUN apt-get update && apt-get -y install gnupg2
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs
RUN nodejs -v
RUN npm -v

# Set working directory
RUN mkdir /usr/share/app
WORKDIR /usr/share/app

# Install Angular CLI
RUN npm install -g @angular/cli@7.0.6

# Install App pacakges
#COPY task-displayer* /usr/share/app/
COPY package*.json /usr/share/app/
RUN ls -la
RUN npm i
