from selenium import webdriver

from base import RANLiveServerTestBase


class SimpleTestCase(RANLiveServerTestBase):

    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_server_is_running(self):
        self.browser.get(self.get_server_url())
        assert "15th Night" == self.browser.title
