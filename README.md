Our challenge is legacy decommissioning, but team Paradigm decided to take a look at the bigger picture. We're about adding real, quantifiable business value. We're about enabling the IRS to become a better, faster, efficient, cost-effective machine. We believe the answer comes in the form of a microservice architecture, and the legacy decommissioning challenge provides an excellent vehicle to showcase the opportunities.

So what is microservices architecture? You've heard the buzz words, and when implemented wrong, that's all it is, buzz words attached to costly technical debt. It has to be designed right from the beginning, and we believe we have the right formula for the IRS. Microservice architecture is the concept of creating an abstract layer between the consumer and the application or business process. This layer is called the enterprise service bus (ESB). The consumer uses an interface that interacts with the service bus, and the service bus communicates with the underlying applications through services. Solution engineers review applications to identify their capabilities and then map those capabilities to individual microservices. Microservices follow the UNIX concept of "doing one thing and doing it well."

Most applications provide more functionality than is required to support the business. They do this to appeal to a larger audience. We believe it's essential to keep the Pareto principle in mind when identifying application capabilities as possible microservice candidates. 80% of an application's use comes from 20% of its capabilities. The idea is to focus on and identify services that deliver real business value.

As a general statement, we are creatures of habit; we don't like change.
Change, be it an application or business process, introduces learning curves, and impacts productivity during the transition period. Change is best adopted when it provides the path of least resistance. The new way should be more comfortable, more efficient, and intuitive. Users will naturally embrace the change with less resistance if they can see the value in it.

Bringing the focus back to the microservices, after publishing all applicable services to the enterprise service bus, it's time to build a slimmed-down intuitive interface made to fit the user. The interface is kept simple and only contains what is necessary for the user to perform their duties. It should be designed with the user experience in mind, adhering to the design principle of least astonishment, which proposes that "the design should match the user's experience, expectations, and mental models." Users should not struggle to understand and interact with an application; it should just make sense.

We built a prototype environment to show you this concept in a real-world scenario. We have the legacy application in the background, the application selected to replace the legacy application, a service bus, and the interface that communicates with the service bus.

http://onportal.net:3000 <-legacy
http://onportal.net:4000 <- new app
http://onportal.net:5000 <- unifying interface

One of the issues encountered when migrating off legacy systems is the dependencies and integrations with that legacy system. Other systems may programmatically interact with the legacy system for their business needs, for example, reporting. The answer is to add the reporting capabilities as a service in the ESB. The service mimics the legacy application's function, enabling consumers to migrate over with minimal effort, generally requiring a change of server name and port number. All other existing logic can remain the same on the consumer's end.

http://onportal.net:5000/reports/csv

In our example, the legacy, replacement application, and ESB are online and operational. Both applications have a connection to the ESB, where they expose their services. The unifying interface, through the ESB, communicates with both applications.

Users can continue to use the legacy application during the transition period. The unifying interface is socialized, and if designed correctly, users will naturally begin to migrate to the new interface. User feedback may lead to improvements on the interface. The unified interface allows the user to interact with incidents in both the legacy and replacement applications. Once users have migrated off the legacy interface and existing integrations repointed to the ESB, it is ready to be decommissioned.

As mentioned before, not all services provided by an application need to be published to the ESB. Users can still leverage the features of the new application when necessary, by access the application directly. If the enterprise finds that a capability is regularly accessed, it can be added as an ESB service.

So what is our future state? Consumers are accessing services through the ESB using a simplified interface, no longer directly accessing the application. This abstraction layer makes future migrations transparent to users.

There is another significant benefit to this approach. As more applications are onboarded to the ESB, the IRS builds a substantial catalog of services or capabilities. Today we have duplication of work across different groups in the IRS. Unfortunately, teams pay an opportunity cost because there is no place to check if a capability they need already exists. A service catalog solves this and allows the IRS to focus efforts on developing new capabilities.

Another benefit, a service catalog allows us to begin thinking in a declarative paradigm rather than imperative to solve business needs. We're able to think about what needs to be done rather than how to do it. A simple example, I want to increase the CPUs on my application server. Today we need to open a change request to add more CPUs, a task to stop monitoring, a job to reboot the server, a task to enable monitoring. The user is responsible for knowing how to achieve their goal. With services, you request more CPU power. The service abstracts away the underlying steps. The service opens a change request in the ticketing system, disables monitoring, instructs VSphere to allocate more CPUs, restarts the system, verifies that the change was successful, and closes the change request.

One final benefit is that services can be monitored and reported on for usage, they can be load balanced, secured, and designed with high availability.

Reporting on the catalog allows us to see exactly how an application is used. When looking for a replacement solution you know exactly how your application is used and what services are used most. This provides a map for discussions with vendors to ensure that the new application provide the same functionality.
