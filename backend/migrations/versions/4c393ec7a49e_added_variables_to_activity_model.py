"""Added variables to activity model

Revision ID: 4c393ec7a49e
Revises: 3e823f28ca4f
Create Date: 2020-06-07 22:50:23.707992

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4c393ec7a49e'
down_revision = '3e823f28ca4f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('activity', sa.Column('code', sa.String(length=64), nullable=True))
    op.add_column('activity', sa.Column('command', sa.String(length=16), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('activity', 'command')
    op.drop_column('activity', 'code')
    # ### end Alembic commands ###
