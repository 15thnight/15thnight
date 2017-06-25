#!/bin/sh
set -x
set -v

# Install firefox and xvfb (for headless firefoxo)
apt-get install firefox xvfb

# Also grab geckodriver
wget  https://github.com/mozilla/geckodriver/releases/download/v0.17.0/geckodriver-v0.17.0-linux64.tar.gz -O ${TRAVIS_BUILD_DIR}/geckodriver.tar.gz

# "Install" geckodriver
tar xf ${TRAVIS_BUILD_DIR}/geckodriver.tar.gz -C /usr/bin/
chmod +x /usr/bin/geckodriver

# Create fx.sh so FirefoxBinary (part of selenium) can execute headless mode.
cat <<EOF > /usr/bin/fx.sh
#!/bin/sh
$(which xvfb) $(which firefox)
EOF

# Make "headless" firefox executable
echo ls /usr/bin/fx.sh
ls /usr/bin/fx.sh
echo  chmod +x /usr/bin/fx.sh
chmod +x /usr/bin/fx.sh
