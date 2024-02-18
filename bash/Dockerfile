FROM mongo:7.0.5

RUN apt update && \
    apt install -y curl wget

WORKDIR /scripts
COPY ./ /scripts

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "sleep 10 && bash import.sh" ]