#!/bin/bash
# https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine

# Enable workload identity for your cluster
gcloud container clusters update data-genie \
  --workload-pool=data-genie-306816.svc.id.goog

# Create Kubernetes Sevice Account (KSA)
kubectl apply -f cloud-sql-proxy-sa.yaml

# Enable the IAM binding between your YOUR-GSA-NAME and YOUR-KSA-NAME:
gcloud iam service-accounts add-iam-policy-binding \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:data-genie-306816.svc.id.goog[default/cloud-sql-proxy-sa]" \
  cloud-sql-proxy-sa@data-genie-306816.iam.gserviceaccount.com

# Add the iam.gke.io/gcp-service-account=GSA_NAME@PROJECT_ID annotation to the Kubernetes service account, using the email address of the Google service account.
kubectl annotate serviceaccount \
  --namespace default \
  cloud-sql-proxy-sa \
  iam.gke.io/gcp-service-account=cloud-sql-proxy-sa@data-genie-306816.iam.gserviceaccount.com
