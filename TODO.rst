====
TODO
====

Docs
====

[X] - Complete layout docs
[X] - Overhaul UI Widgets docs
[X] - Overhaul forms docs
[X] - Overhaul workflows docs
[X] - Overhaul AJAX docs
[X] - Create translations documentation
[X] - Create security docs
[ ] - Document expected permissions for tiles and actions
[ ] - Create writing tests documenatation
[ ] - Create twisted integration documentation
[ ] - Create websocket integration documentation
[ ] - Create tutorial extending cone.example
[ ] - Proper cross linking all over the place


Roadmap
-------

1.0a2
-----

[ ] - Test ``cone.app.browser.actions.DropdownAction`` with BS3
[ ] - ``cone.app.browser.authoring.OverlayFormTile`` is superfluous.
[ ] - Overhaul settings rendering. available settings should be rendered in
      the navtree. ``SettingsBehavior`` for settings forms probably superfluous
      then.
[ ] - Set ``ISecured`` on ``cone.app.workflow.WorkflowACL``
[ ] - ``cone.app.browser.copysupport:124``: trigger ``contextchanged`` on
      ``#layout`` instead of ``.contextsensitiv``.
[ ] - Get rid of remaining ``contextsensitiv`` CSS class related bdajax
      bindings and remove ``contextsensitiv`` CSS class entirly from markup and
      tests.
[ ] - Bind sharing view to ``cone.app.interfaces.IPrincipalACL``.
[ ] - Consolidate ``cone.app.model.AppSettings.__acl__```and
      ``cone.app.security.DEFAULT_SETTINGS_ACL`` which is not used yet in
      ``cone.app``.
[ ] - Fix lookup in ACL registry. First node by class or base class and node
      info name if given, Then by class or base class only if not found, then
      by node info name only if no class given at lookup. Or so...
[ ] - Create and use constants for all default roles and permissions.

1.0b1
-----

[ ] - Merge ``pyramid_upgrade`` branches back to master.
[ ] - Restore B/C compatibility for pyramid < 1.5
[ ] - Adopt docs for using ``waitress`` instead of ``paster``.
[ ] - Add template for creating ``cone.app`` plugins.
[ ] - Update to jQuery 2.0.
[ ] - Adopt livesearch JS intergration to provide hooks for passing typeahead
      options and datasets instead of just datasets.

1.0
---

[ ] - Add proper API docs to code and include in docs.

1.1
---

[ ] - Overhaul resource registration and delivery keeping B/C.
    [ ] - Think about using fanstatic
    [ ] - Add resource export as JSON if 3rd party build tool is preferred.
[ ] - Overhaul plugin entry hooks staying closer to pyramid if possible.

1.2
---

[ ] - Migrate Doctests to Unittests where appropriate.
[ ] - Python 3 support.