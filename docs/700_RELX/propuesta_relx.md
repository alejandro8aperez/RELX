# RELX Environmental Challenge 2026: AQUA-8 Smart Water Hub

## 1. Project Title
AQUA-8 Modular Desalination System (AMDS) - A Smart Water Hub for Coastal Communities

## 2. Category
Clean Water or Sanitation

## 3. Executive Summary
Coastal communities in Latin America, such as the Wayúu in Manaure, Colombia, face a paradox: abundant seawater but severe scarcity of potable water. The AQUA-8 Modular Desalination System is a paradigm shift from building traditional desalination plants to deploying "Water as Infrastructure." AQUA-8 is a highly intelligent, 100% solar-powered, modular desalination platform built into ISO 20-foot containers. Designed like an industrial "LEGO" system, it strictly separates wet processes from electrical components across distinct modules. AQUA-8 is not just a plant; it is a "Living Lab" that integrates an advanced SCADA system for predictive maintenance, remote telemetry, and optimized energy management (consuming <3 kWh/m³). By establishing a pilot in Manaure, the project will also pilot a circular economy approach by integrating brine management with the local salt industry, redefining how water is produced in remote areas.

## 4. The Problem
Manaure faces a severe water crisis while having the highest solar radiation in Colombia. Communities depend on highly expensive water trucking ($2.00 USD/m³) or contaminated ponds. Traditional desalination solutions often fail in these environments because they are monolithic structures, difficult to maintain, rely on expensive grid electricity or diesel, and destructively discharge brine into fragile marine ecosystems. Furthermore, when a single component fails in a traditional compact plant, the entire system must often be disassembled.

## 5. The Innovation: The AQUA-8 AMDS Architecture
AQUA-8 redefines the architecture of small-scale desalination:
1. **Modular "LEGO" Architecture:** Instead of cramming everything into one box, AQUA-8 uses functional containers: Module A (Intake & Pre-treatment), Module B (RO & Energy Recovery), Module C (Post-treatment), and Module D (Electrical, Solar Inverters, SCADA). This allows easy transportation, independent upgrades, and highly simplified maintenance.
2. **Smart SCADA Microgrid:** Designed by electrical engineering experts, Module D operates as an intelligent microgrid. It optimizes RO production based on real-time solar irradiance, utilizing deployable solar roofs that act as both energy generators and thermal shields for the containers.
3. **Circular Brine Integration:** Sited in Manaure (Colombia's salt capital), the project transforms brine from an environmental liability into a resource, integrating it with local evaporation ponds for industrial salt recovery.

## 6. Technical Readiness & Evidence of Operation

Although AQUA-8 is a new proposition, the project draws on proven engineering foundations and concrete preliminary work:

1. **FEED Engineering Completed:** The Front-End Engineering Design (FEED) is at an advanced stage. The electrical and pumping calculation memo (AQ8-CALC-001) demonstrates that the target specific energy consumption of <3 kWh/m³ is achievable, using isobaric energy recovery devices and a 5.0 kWp solar array. The hydraulics, membrane selection, and power balance have been simulated and validated.

2. **SCADA Simulation Prototype:** A functional real-time SCADA core simulation (`aqua_core_sim.py`) has been developed and tested, emulating the PLC logic, sensor readings, and control loops (pressure, tank level, water quality). This serves as the digital twin foundation for the physical prototype.

3. **Multidisciplinary Team Experience:** The AQUA-8 team combines expertise in electrical engineering (Alejandro Ochoa), environmental engineering (Bertulfo Pérez), project economics (Hugo Isaza), and community integration (Rubén Botero) — each with professional track records in water infrastructure, industrial automation, and social projects.

4. **Site-Specific Data Collected:** Water quality data, solar radiation records, and logistical assessments for Manaure, La Guajira have been gathered and analyzed, including photographic documentation and a geo-referenced route survey (`Ruta de fotos.xlsx`).

5. **Industry Benchmarking:** Containerized RO systems are a proven technology deployed globally (Canary Islands, Australia, Middle East). AQUA-8 differentiates by strictly separating wet/dry modules for maintainability and integrating a smart SCADA microgrid — an evolution, not an untested concept.

## 7. Practical Applicability & Scalability
The requested $75,000 will fund "Phase I - Prototype R&D", establishing a 10,000 Liters/day (10 m³/day) operational pilot. Because the system is containerized, installation time on-site is under 8 hours—requiring minimal civil works. Once validated, the system scales seamlessly to Phase II (50 m³/day) and Phase III (Commercial deployment up to 500 m³/day) simply by adding more identical modules. The design ensures it can be manufactured in Colombia and shipped globally to any coastal emergency, island, or off-grid community.

## 8. Impact on Equity and Inclusion
The Wayúu are among the most marginalized indigenous groups in the Americas. AQUA-8 empowers these communities by providing localized, highly reliable water infrastructure that does not depend on erratic government water trucks. The "Living Lab" approach in Manaure will include local technicians in the operation and maintenance training, fostering technology transfer and creating specialized green jobs in an impoverished region.

## 9. Impact Indicators & Measurability

AQUA-8 defines clear, verifiable indicators across three dimensions, detailed in the companion document (`indicadores.md`):

- **Water & Sanitation:** 10 m³/day of potable water produced at <500 ppm TDS, serving 300 direct beneficiaries with 30 L/person/day.
- **Ecosystem Restoration & Sustainable Oceans:** Zero brine discharge to the ocean — 100% of the 12.2 m³/day brine stream is integrated with Manaure's salt evaporation ponds for industrial salt recovery, protecting coastal marine ecosystems.
- **Measurable & Verifiable:** All indicators are monitored in real time by the SCADA system (flow, pressure, conductivity, energy consumption, uptime >95%). Socio-environmental metrics (beneficiaries reached, carbon footprint avoided, brine valorized) are tracked quarterly.
- **Innovation Clearly Linked to Water:** Every element of the AQUA-8 innovation — modular LEGO architecture, solar microgrid, circular brine management — is directly tied to improving drinking water access, sanitation, and ocean health.

For the complete indicator framework, see the [Indicators Document](indicadores.md).

## 10. Budget and Project Execution
AQUA-8 is executed as an R&D engineering project. The $75,000 grant covers: Engineering payroll for the multidisciplinary design team ($32k), Process materials & RO equipment ($15k), SCADA & Instrumentation ($5k), Solar PV components ($7k), Container mechanics & prototyping ($8k), Laboratory & QA ($3k), Field validation in Manaure ($2k), and Contingencies ($3k). This budget structure ensures the delivery of a fully documented, patentable product ready for mass manufacturing, not just a one-off machine.

## 11. Alignment with SDGs
- **SDG 6**: Providing decentralized, highly efficient (recovery ~45%) drinking water infrastructure.
- **SDG 14**: Protecting marine ecosystems through circular brine valorization instead of toxic ocean discharge.
- **SDG 9**: Fostering resilient infrastructure and sustainable industrialization through the smart, modular container design.
