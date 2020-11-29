FROM alpine

EXPOSE 8080
RUN mkdir /radium_data
VOLUME [ "/radium_data" ]
COPY "radium" /radium
ADD "entrypoint.sh" /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
