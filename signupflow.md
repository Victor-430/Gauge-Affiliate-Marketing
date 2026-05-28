``` mermaid

flowchart LR
  A[Login] --> B{Email verified?}
  B -- No --> D[Direct to signup completion flow]
  D --> E[Send link to verify email and activate account]

  B -- Yes --> C{Account activated?}
  C -- No --> F[Display message: Please activate account to use app features]
  C -- Yes --> G[Login]

  H[Subsequent login] --> I{Account activated?}
  I -- Yes --> J[No activation needed]
  I -- No --> D

```