from plumber import plumbing
from node.behaviors import (
    Adopt,
    Nodespaces,
    Attributes,
    Nodify,
    OdictStorage,
    DefaultInit,
)
from node.utils import instance_property
from pyramid.security import (
    Everyone,
    Allow,
    Deny,
    ALL_PERMISSIONS,
)
from ..model import (
    AppNode,
    BaseNode,
    CopySupport,
    Properties,
)
from ..workflow import (
    WorkflowState,
    WorkflowACL,
)
from ..security import (
    PrincipalACL,
    DEFAULT_ACL,
)


@plumbing(WorkflowState, WorkflowACL)
class WorkflowNode(BaseNode):

    @property
    def properties(self):
        props = Properties()
        props.in_navtree = True
        props.wf_name = u'dummy'
        # XXX: check in repoze.workflow the intended way for naming
        #      transitions
        props.wf_transition_names = {
            'initial_2_final': 'Finalize',
        }
        return props

    def __call__(self):
        pass


class InexistentWorkflowNode(WorkflowNode):

    @property
    def properties(self):
        props = super(InexistentWorkflowNode, self).properties
        props.wf_name = u'inexistent'
        return props


class StateACLWorkflowNode(WorkflowNode):
    state_acls = {
        'initial': [
            (Allow, 'role:manager', ['manage', 'edit', 'change_state']),
            (Allow, Everyone, ['login']),
            (Deny, Everyone, ALL_PERMISSIONS),
        ],
        'final': [
            (Allow, 'role:manager', ['view', 'edit', 'change_state']),
            (Deny, Everyone, ALL_PERMISSIONS),
        ],
    }


@plumbing(
    PrincipalACL,
    AppNode,
    Adopt,
    Nodespaces,
    Attributes,
    DefaultInit,
    Nodify,
    OdictStorage)
class SharingNode(object):

    @property
    def __acl__(self):
        return DEFAULT_ACL

    @instance_property
    def principal_roles(self):
        return dict()


@plumbing(CopySupport)
class CopySupportNode(BaseNode):

    def __call__(self):
        print 'Called: %s' % self.name
