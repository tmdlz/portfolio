Crée un diagramme de Gantt interactif pour mon projet ConseilPro 
(infrastructure réseau d'entreprise virtualisée sur Proxmox).

Période : janvier 2026 → avril 2026

Voici les phases et tâches dans l'ordre chronologique :

PHASE 1 — Préparation (janvier 2026)
- Installation Proxmox VE
- Configuration hardware (NVMe, RAM)
- Analyse du référentiel BTS SIO SISR

PHASE 2 — Infrastructure réseau (février 2026)
- Configuration bridge vmbr0 et vmbr1
- Déploiement OPNsense 26.1
- Création des 6 VLANs (10, 20, 30, 40, 50, 99)
- Configuration DHCP Dnsmasq (remplacement Kea DHCP bugué)
- Mise en place règles firewall isolation inter-VLAN
- Tests de connectivité et isolation

PHASE 3 — Déploiement des services (mars 2026)
- DNS Bind9 + NTP (VLAN 10)
- Samba fileserver RH (VLAN 20)
- Nginx intranet Commerciaux (VLAN 30)
- Samba fileserver Juridique (VLAN 40)
- Kali Linux (VLAN 50)
- Zabbix 7.0 + MariaDB (VLAN 99)
- Active Directory Windows Server 2022 (VLAN 99)

PHASE 4 — Sauvegarde et supervision (fin mars 2026)
- Proxmox Backup Server (PBS)
- Configuration NVMe 1To dédié aux backups
- Connexion agents Zabbix sur tous les serveurs
- Tests de restauration PBS

PHASE 5 — Documentation et examens (avril 2026)
- Rédaction fiches de réalisation E6
- README GitHub
- Fiches de compréhension (Nginx, Samba, Zabbix)
- Préparation oral E6

Style souhaité : moderne, couleurs par phase, 
affichage mois par mois, barres arrondies.