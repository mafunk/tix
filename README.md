
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

## Dev

> add 127.0.0.1 tickets.dev to hosts file

`skaffold dev`

First time visting tickets.dev. type: `thisisunsafe` to bypass chrome security warning

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

## NATS Testing

`kubectl port-forward`[nats-depl-] 4222:4222`, temp process, run in seperate terminal window

**Todo** Publish failures: store event in mongo alongside change, if one of them fails revert/dont sent
    * have sent flag so when NATS sends, can flip flag