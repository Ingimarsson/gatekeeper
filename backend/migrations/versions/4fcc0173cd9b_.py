"""empty message

Revision ID: 4fcc0173cd9b
Revises: 39e84a1cbcd9
Create Date: 2023-06-28 11:36:26.896912

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4fcc0173cd9b'
down_revision = '39e84a1cbcd9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('log', sa.Column('alpr_image', sa.String(length=64), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('log', 'alpr_image')
    # ### end Alembic commands ###
