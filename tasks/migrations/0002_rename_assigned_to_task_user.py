# Generated by Django 5.0.6 on 2024-07-01 21:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='assigned_to',
            new_name='user',
        ),
    ]
