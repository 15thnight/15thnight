from _15thnight.util import to_local_datetime


def marshal_user_info(user):
    return dict(
        name=user.name,
        organization=user.organization,
        email=user.email,
        phone_number=user.phone_number,
    )

def marshal_current_user(user):
    if not user.is_authenticated:
        return None
    services = [dict(name=s.name, id=s.id) for s in user.services]
    return dict(marshal_user_info(user), role=user.role,
                created_at=user.created_at, services=services)

def marshal_alert(alert, user):
    base_alert = dict(
        id=alert.id,
        user=marshal_user_info(alert.user),
        created_at=to_local_datetime(alert.created_at),
        description=alert.description,
        gender=alert.gender,
        age=alert.age,
    )
    if user.role == 'advocate' or user.role == 'admin':
        total_resolved = len([need for need in alert.needs if need.resolved])
        needs = [marshal_need(need, user) for need in alert.needs]
        return dict(base_alert, responses=len(alert.responses),
                    totalResolved=total_resolved, needs=needs)
    elif user.role == 'provider':
        responses = len([r for r in alert.responses if user.id == r.user_id])
        needs = [marshal_need(n, user) for n in alert.notified_needs(user)]
        return dict(base_alert, responses=responses, needs=needs)


def marshal_need(need, user):
    base = dict(
        id=need.id,
        alert_id=need.alert_id,
        service_name=need.service_name,
        resolved=need.resolved,
        resolved_at=to_local_datetime(need.resolved_at)
    )
    if user.role == 'advocate' or user.role == 'admin':
        pledges = [marshal_pledge(pledge, user) for pledge in need.pledges]
        return dict(base, pledges=pledges)
    elif user.role == 'provider':
        pledges = [
            marshal_pledge(pledge, user) for pledge in need.pledges
            if pledge.provider_id == user.id
        ]
        return dict(base, pledges=pledges)


def marshal_pledge(pledge, user):
    base = dict(
        id=pledge.id,
        created_at=to_local_datetime(pledge.response.created_at),
        message=pledge.message,
        selected=pledge.selected
    )
    if user.role == 'advocate' or user.role == 'admin':
        return dict(base, provider=marshal_user_info(pledge.response.user))
    elif user.role == 'provider':
        return base

def marshal_category(category):
    return dict(
        id=category.id,
        name=category.name,
        description=category.description,
        services=[marshal_service(service) for service in category.services],
        sort_order=category.sort_order
    )

def marshal_service(service):
    return dict(
        id=service.id,
        name=service.name,
        description=service.description,
        category=dict(
            id=service.category.id,
            name=service.category.name,
            description=service.category.description
        ),
        sort_order=service.sort_order
    )

def marshal_user(user):
    return dict(
        id=user.id,
        name=user.name,
        organization=user.organization,
        email=user.email,
        role=user.role,
        phone_number=user.phone_number,
        created_at=user.created_at,
        services=[dict(name=s.name, id=s.id) for s in user.services]
    )
