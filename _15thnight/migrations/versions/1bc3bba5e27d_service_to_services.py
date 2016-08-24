"""service to services

Revision ID: 1bc3bba5e27d
Revises: 3e7e65c44fc2
Create Date: 2016-08-21 07:43:12.324960

"""

# revision identifiers, used by Alembic.
revision = '1bc3bba5e27d'
down_revision = '3e7e65c44fc2'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.rename_table("service", "services")


def downgrade():
    op.rename_table("services", "service")
