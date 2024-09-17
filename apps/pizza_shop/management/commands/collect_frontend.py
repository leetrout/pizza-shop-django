import os
import shutil
import subprocess

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Collects the frontend output into the app static files"

    # TODO: Args to support build or not

    def handle(self, *args, **options):
        app_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), os.pardir, os.pardir)
        )
        frontend_path = os.path.abspath(os.path.join(app_path, "frontend"))

        self.stdout.write("Installing npm packages...")
        npm_install_proc = subprocess.run(
            ["npm", "i"],
            cwd=frontend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if npm_install_proc.returncode != 0:
            self.stderr.write(npm_install_proc.stdout.decode("utf-8"))
            raise CommandError("Could not install npm packages")
        self.stdout.write(npm_install_proc.stdout.decode("utf-8"))

        self.stdout.write("Building...")
        npm_build_proc = subprocess.run(
            ["npm", "run", "build"],
            cwd=frontend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if npm_build_proc.returncode != 0:
            self.stderr.write(npm_build_proc.stdout.decode("utf-8"))
            raise CommandError("Build failed")
        self.stdout.write(npm_build_proc.stdout.decode("utf-8"))

        src = os.path.join(frontend_path, "dist")
        dst = os.path.join(app_path, "static")
        shutil.copytree(src, dst, dirs_exist_ok=True)

        self.stdout.write(self.style.SUCCESS("Frontend build successfully"))
