
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

## Todo

 * [ ] Use Github Packages for hosting common npm module
   * [ ] right now fails to pull packages on install
 * [ ] Use Github Packages for hosting docker iamges
   * [ ] learn how to setup hosted solution to point towards github packages
   * [ ] Maybe AWS container service is fine? if hosting in AWS
 * [ ] Use AWS EKS
   * [ ] maybe use Fargo?
   * [ ] maybe use their container services instead of github packages
   * [ ] use CloudWatch for logs/monitoring
   * [ ] https://aws.amazon.com/blogs/opensource/network-load-balancer-nginx-ingress-controller-eks/
   * [ ] Setup autoscaling?
 * [ ] Https - cert-manager.io
 * [ ] email support
   * [ ] send email after payment created, use new service(mailchimp, sendgrid, etc)
 * [ ] Build step for prod cluster
   * [ ] run containers with prod builds
     * [ ] seperate dockerfile for dev, npm run build, node index.js
 * [ ] Create a staging cluster
   * [ ] when push to dev happens

## Dev

> add 127.0.0.1 tickets.dev to hosts file

`skaffold dev`

First time visting tix.dev. type: `thisisunsafe` to bypass chrome security warning

###  Workflow

1) [local] Make change to code for x service
2) [local] Commit code to a branch(not master)
3) [local] Push branch to github
4) [github] Create PR to master
   1) auto runs tests
   2) if tests pass, merge allowed
5) [github] Build and deploy

### Github Actions

> Todo: run tests for PR to master, commit/push to dev

1) [pull request] run tests
   1) [auth] only if changes in /auth
   2) [orders] only if changes in /orders
   3) [payments] only if changes in /payments
   4) [tickets] only if changes in /tickets
2) [push/merge] build and deploy, only on master
   1) build image > push to docker hub > update deployment
      1) auth, client, expiration, tickets, orders, payments
   2) build > publish npm package
      1) common
   3) apply k8s yaml files

> Add Docker hub secret to Github

1) Github > Project > settings > Secrets
   1) DOCKER_USERNAME
   2) DOCKER_PASSWORD
   3) DO_TOKEN - digital ocean access token
   4) CLUSTER_NAME
   

## Hosting Providers

    * DigitalOcean
      * easy
      * ~ $40/m
    * AWS
      * hardest
      * ~ $126/m
    * Google Cloud
      * easy
      * ~ $113/m
    * Azure
      * easy
      * ~ $72/m

    * AWS/GC, paying about $72/m just for kubernetes control plain
      * 1 cent per hour

### DigitalOcean

    1) Get coupon code, create account, will need CC
    2) Create hosted cluster
       1) Create > Clusters > Cluster Capacity > (Standard Ndoes, 10/m, 3) > Choose Name > tix > Create Cluster
    3) Create kubectl context for DigitalOcean
       1) Install DigitalOcean CLI
          1) https://github.com/digitalocean/doctl
          2) Go to DigitalOcean dashboard > api >generate access token > copy token
          3) `doctl auth init` > past token
       2) `doctl kubernetes cluster kubeconfig save <cluster_name>`
          1) To get name: Dashboard > Kubernetes
       3) Good for debugging from local machine
    4) Create secrets
       1) point to DO context, `kubectl config use-context [context name]`
          1)to get list of contexts, `kubectl config view`
        1) `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=`
        2) `kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=`
     1) Setup Ingress
        1) point to DO context, `kubectl config use-context [context name]`
        2) https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean
           1) `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.35.0/deploy/static/provider/do/deploy.yaml`
     2) Buy domain name
        1) Point to DigitalOcean load balancer ip for cluster
           1) Domain Registery: nameservers, Custom DNS
              1) ns1.digitalocean.com
              2) ns2.digitalocean.com
              3) ns3.digitalocean.com
           2) DigitalOcean > Networking > Domains > Add Domain
              1) A - @, select load balancer, 30 > create record
              2) CNAME - www, @, 30 > create record
        2) Replace host name in prod ingress yaml
     3) To Shut down
        1) Networking > load balancers > more >destroy
        2) Kubernetes > more > destroy

## Terms of Kubernetes

    * Kubernetes Cluster - collection of nodes + orchestrator
    * Node - VM that will run our containers
    * Pod - More or less a container, can run multiple containers
    * Deployment - Monitors a set of pods, make sure tehy are running and restarts them if they crash
    * Service - Provides easy to  remember URL to access a running container
    * Master Node - Also known as Control Plain

## Common Commands of Kubernets

    * kubectl get pods
    * kubectl exect -it [pod_name] [cmd]
    * kubectl logs [pod_name]
    * kubectl delete [pod_name]
    * kubectl apply -f [config_file]
    * kubectl describe pod [pod_name]
    * kubectl config view - list of contexts
    * kubectl config use-context [context_name] - switch context

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