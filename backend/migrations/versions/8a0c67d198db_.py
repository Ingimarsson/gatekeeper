"""empty message

Revision ID: 8a0c67d198db
Revises: 3662dc3edcb3
Create Date: 2022-03-20 17:58:26.005192

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a0c67d198db'
down_revision = '3662dc3edcb3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('language', sa.String(length=64), nullable=True))
    op.execute("""UPDATE "user" SET language = 'en'""")
    op.alter_column('user', 'language', nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'language')
    # ### end Alembic commands ###