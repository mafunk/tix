
## Install Docker/Kubernetes

1. Install Docker
2. Open Docker Settings
   1. Kubernetes
   2. Enable Kubernetes
   3. Restart
   4. Test if working, new terminal, `kubectl version`
3. Install ingress-nginx
   1. https://kubernetes.github.io/ingress-nginx/deploy/
4. Install Skaffold
   1. https://skaffold.dev/docs/install/
5. `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf`
   1. `kubectl get secrets`
6. `kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=asch`

## Dev

> add 127.0.0.1 tickets.dev to hosts file

`skaffold dev`

First time visting tickets.dev. type: `thisisunsafe` to bypass chrome security warning

###  Workflow

1) [local] Make change to code for x service
2) [local] Commit code to a branch(not master)
3) [local] Push branch to github
4) [github] Create PR to master
   1) auto runs tests
   2) if tests pass, merge allowed
5) [github] Build and deploy

### Github Actions

1) [pull request] run tests

## Terms of Kubernetes

    * Kubernetes Cluster - collection of nodes + orchestrator
    * Node - VM that will run our containers
    * Pod - More or less a container, can run multiple containers
    * Deployment - Monitors a set of pods, make sure tehy are running and restarts them if they crash
    * Service - Provides easy to  remember URL to access a running container

## Common Commands of Kubernets

    * kubectl get pods
    * kubectl exect -it [pod_name] [cmd]
    * kubectl logs [pod_name]
    * kubectl delete [pod_name]
    * kubectl apply -f [config_file]
    * kubectl describe pod [pod_name]


### Auth Service

    * /api/users/signup - POST, email: string, password: string
    * /api/users/signin - POST, email: string, password, string
    * /api/users/signout - POST
    * /api/users/current - GET

## Tickets Service

    * /api/tickets - GET
    * /api/tickets/:id - GET
    * /api/tickets - POST, title: string, price: string
    * /api/tickets/:id - PUT, title: string, price string

## Orders Service

    * /api/orders - GET
    * /api/orders/:id - GET
    * /api/orders - POST, ticketId: string
    * /api/orders/:id - DELETE

## Payments Service

    * /api/payments - POST, token: string, orderId: string

## NATS Testing

`kubectl port-forward`[nats-depl-] 4222:4222`, temp process, run in seperate terminal window

**Todo** Publish failures: store event in mongo alongside change, if one of them fails revert/dont sent
    * have sent flag so when NATS sends, can flip flag