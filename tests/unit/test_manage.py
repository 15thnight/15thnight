from manage import seed_db
from tests.base import RANTestBase


class ManageTests(RANTestBase):

    def test_seed_db(self):
        seed_db()
