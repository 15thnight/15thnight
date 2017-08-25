"""migrate need and pledge data

Revision ID: 5955de3d192c
Revises: c16b76d57fb5
Create Date: 2017-06-02 16:38:32.474125

"""

# revision identifiers, used by Alembic.
revision = '5955de3d192c'
down_revision = 'c16b76d57fb5'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa




def upgrade():
    queries = [
        'update need set service_name=('
            'select name from service where service.id=need.service_id'
        ')',
        'update need set service_description=('
            'select description from service where service.id=need.service_id'
        ')',
        'update need set category_name=('
            'select c.name from service '
            'left join categories c on service.id=c.id '
            'where service.id=need.service_id'
        ')',
        'update need set category_description=('
            'select c.description from service '
            'left join categories c on service.id=c.id '
            'where service.id=need.service_id'
        ')',
        'update need_provided set provider_id=('
            'select user_id from responses '
            'where responses.id=need_provided.response_id'
        ')',
        'update need_provided set alert_id=('
            'select alert_id from responses '
            'where responses.id=need_provided.response_id'
        ')'
    ]
    for q in queries:
        op.get_bind().execute(sa.text(q))


def downgrade():
    pass
