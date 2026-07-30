import os
import sys
import traceback

print('CWD:', os.getcwd())
print('Python executable:', sys.executable)
print('Sys.path[0]:', sys.path[0])

try:
    # Ensure project root is on sys.path
    proj_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if proj_root not in sys.path:
        sys.path.insert(0, proj_root)
    print('Inserted project root to sys.path:', proj_root)

    import backend.main as m
    print('Imported backend.main successfully')
    try:
        app = getattr(m, 'app', None)
        if app is None:
            print('No app attribute found in backend.main')
        else:
            print('App title:', getattr(app, 'title', '<no title>'))
            print('Routers included:', [r.tags for r in app.router.routes if getattr(r, 'tags', None)])
    except Exception as e:
        print('Error while inspecting app:', e)

except Exception as exc:
    print('IMPORT EXCEPTION:')
    traceback.print_exc()
    sys.exit(2)

print('Done')
