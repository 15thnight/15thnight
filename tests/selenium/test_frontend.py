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
            # Chrome/Firefox
            browser_str = browser_str[0].upper() + browser_str[1:]
        self.browser = getattr(webdriver, browser_str)()

    def tearDown(self):
        self.browser.quit()

    def test_server_is_running(self):
        self.browser.get(self.get_server_url())
        assert "15th Night" == self.browser.title
