"""empty message

Revision ID: 39e84a1cbcd9
Revises: a3a0c9bd9df9
Create Date: 2023-05-20 19:05:40.422757

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '39e84a1cbcd9'
down_revision = 'a3a0c9bd9df9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('controller_status', sa.Column('detector_time', sa.Integer(), nullable=True))
    op.add_column('controller_status', sa.Column('free_memory', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('controller_status', 'free_memory')
    op.drop_column('controller_status', 'detector_time')
    # ### end Alembic commands ###
