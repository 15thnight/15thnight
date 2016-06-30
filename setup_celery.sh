#!/bin/bash

if [ $(id -u) != 0 ]
then
    echo "This script must run this as root."
    exit 1
fi

echo "Setting up Celery"
CPU_COUNT=$(cat /proc/cpuinfo|grep precessor|wc -l)
let "THREAD_COUNT = $CPU_COUNT + 1"
sed \{"s?PROJECT_PATH?$(pwd)?g; s?THREAD_COUNT?$THREAD_COUNT?g;"\} celeryd.template > celeryd.conf

echo "Creating /etc/default/celeryd"
mkdir -p /etc/default/
mv celeryd.conf /etc/default/celeryd

echo "Creating /etc/init.d/celeryd"
mkdir -p /etc/init.d/
cp celeryd.init /etc/init.d/celeryd

if [ ! $(id -u "celery") ]
then
    useradd -M -r -s /bin/false celery
    echo "User celery created"
else
    echo "User celery already exists. Nothing to do"
fi
echo "Celery is now ready; use your init service to start celeryd"
