======
Layout
======

.. _layout_main_template:

Main Template
-------------

The main template of ``cone.app`` can be altered by overriding
``cone.app.cfg.main_template``.

.. code-block:: python

    import cone.app

    cone.app.cfg.main_template = 'cone.example.browser:templates/main.pt'


Application Layout
------------------

The main layout of the application is implemented as tile with name ``layout``.

The referring template lives in ``cone.app.browser:templates/layout.pt`` and
is structured as follows.

.. figure:: ../../artwork/layout.svg
    :width: 100%

The layout can be configured for each application node. Layout configuration
is described in ``cone.app.interfaces.ILayout`` and expected via application
model node on property ``layout``.

.. code-block:: python

    from cone.app.model import BaseNode
    from cone.app.model import Layout

    class ExampleApp(BaseNode):

        @property
        def layout(self):
            layout = Layout()
            layout.mainmenu = True
            layout.mainmenu_fluid = False
            layout.livesearch = True
            layout.personaltools = True
            layout.columns_fluid = False
            layout.pathbar = True
            layout.sidebar_left = ['navtree']
            layout.sidebar_left_grid_width = 3
            layout.content_grid_width = 9
            return layout

Alternatively to overwriting the ``layout`` property on model node, an
``ILayout`` implementing adapter can be provided. Default ``layout`` property
implementation on ``AppNode`` tries to find an ``ILayout`` adapter for
``self``.

.. code-block:: python

    from cone.app.interfaces import IApplicationNode
    from cone.app.model import Layout
    from zope.component import adapter

    @adapter(IApplicationNode)
    class ExampleLayout(Layout):

        def __init__(self, model):
            super(ExampleLayout, self).__init__()
            self.model = model
            self.mainmenu = True
            self.mainmenu_fluid = False
            self.livesearch = True
            self.personaltools = True
            self.columns_fluid = False
            self.pathbar = True
            self.sidebar_left = ['navtree']
            self.sidebar_left_grid_width = 3
            self.content_grid_width = 9

Provided layout settings:

- **mainmenu**: Flag whether to display mainmenu.

- **mainmenu_fluid**: Flag whether mainmenu is fluid.

- **livesearch**: Flag whether to display livesearch.

- **personaltools**: Flag whether to display personaltools.

- **columns_fluid**: Flag whether columns are fluid.

- **pathbar**: Flag whether to display pathbar.

- **sidebar_left**: List of tiles by name which should be rendered in sidebar.

- **sidebar_left_grid_width**: Sidebar grid width as integer, total grid width
  is 12.

- **content_grid_width**: Content grid width as integer, total grid width
  is 12.
