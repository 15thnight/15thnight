from selenium import webdriver

from tests.base import RANLiveServerTestBase


class SimpleTestCase(RANLiveServerTestBase):

    def setUp(self):
        """Check config for which browser to use for testing."""
        browser_str = self.app.config.get("TEST_BROWSER", "Firefox").lower()
        if browser_str == 'ie':
            browser_str.upper()
        elif browser_str == 'phantomjs':
            browser_str = 'PhantomJS'
        else:
            browser_str = browser_str[0].upper() + browser_str[1:]

        if browser_str.lower() == 'firefox':
            # Firefox Headless
            from selenium.webdriver import firefox
            from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
            fx_opts = firefox.options.Options()
            fx_opts.add_argument("--headless")
            fx_bin = FirefoxBinary(
                firefox_path="/home/sophos/bin/fx.sh")
            self.browser = webdriver.firefox.webdriver.WebDriver(
                firefox_options=fx_opts, firefox_binary=fx_bin,
                capabilities=fx_opts.to_capabilities()
            )
        else:
            self.browser = getattr(webdriver, browser_str)()

    def tearDown(self):
        self.browser.quit()

    def test_server_is_running(self):
        self.browser.get(self.get_server_url())
        assert "15th Night" == self.browser.title
