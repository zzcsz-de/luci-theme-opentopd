// Use the same compiler mode as LuCI runtime.trycompile().
for (let path in ARGV) {
 loadfile(path, { raw_mode: false });
 printf('Compiled %s\n', path);
}
