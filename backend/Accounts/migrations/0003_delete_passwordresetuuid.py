# Generated by Django 5.0.3 on 2024-03-27 19:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Accounts', '0002_passwordresetuuid'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PasswordResetUUID',
        ),
    ]