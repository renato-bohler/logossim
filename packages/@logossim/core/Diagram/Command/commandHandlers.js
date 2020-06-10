import { PointModel } from '@projectstorm/react-diagrams';

const commandHandlers = ({ engine, editComponentConfiguration }) => {
  const adjustLink = (link, nodes = []) => {
    const nodeList = [
      ...Object.values(
        engine
          .getModel()
          .getActiveNodeLayer()
          .getModels(),
      ),
      ...nodes,
    ];

    /**
     * Port instance could have changed in consequence of component
     * configuration edit.
     */
    let sourcePort = link.getSourcePort();
    if (sourcePort) {
      const node = nodeList.find(
        n =>
          n.getID() ===
          link
            .getSourcePort()
            .getParent()
            .getID(),
      );

      sourcePort = node.getPort(sourcePort.getName());

      link.setSourcePort(sourcePort);
      sourcePort.addLink(link);
    }

    let targetPort = link.getTargetPort();
    if (targetPort) {
      const node = nodeList.find(
        n =>
          n.getID() ===
          link
            .getTargetPort()
            .getParent()
            .getID(),
      );

      targetPort = node.getPort(targetPort.getName());

      link.setTargetPort(targetPort);
      targetPort.addLink(link);
    }

    if (link.getBifurcationSource())
      link.getBifurcationSource().addBifurcation(link);

    if (link.getBifurcationTarget())
      link.getBifurcationTarget().addBifurcation(link);

    return link;
  };

  return {
    /**
     * Componend added handler. Occurs when a component is added or
     * pasted.
     */
    componentsAdded: ({ nodes }) => {
      engine.commands.add({
        execute: () => {
          nodes.forEach(node => engine.getModel().addNode(node));
        },
        undo: () => {
          nodes.forEach(node => node.remove());
        },
      });
    },

    /**
     * Component configuration edit handler.
     */
    componentEdited: ({ node, configurations, links }) => {
      engine.commands.add({
        execute: () => {
          editComponentConfiguration(node, configurations.after);
        },
        undo: () => {
          editComponentConfiguration(node, configurations.before);

          links.before.forEach(link =>
            engine.getModel().addLink(adjustLink(link)),
          );
        },
      });
    },

    /**
     * Link added handler. Occurs on new links or bifurcations.
     */
    linkAdded: ({ link }) => {
      engine.commands.add({
        execute: () => {
          engine.getModel().addLink(adjustLink(link));
        },
        undo: () => {
          link.remove();
        },
      });
    },

    /**
     * Link changed handler. Occurs when a link is extended.
     */
    linkChanged: ({ before, after }) => {
      const handleLinkChanged = (from, to) => {
        const link = engine.getModel().getLink(from.id);

        // Update link points
        link.setPoints(
          from.points.map(position => {
            const point = new PointModel({ link });
            point.setPosition(position);
            return point;
          }),
        );

        // Updates bifurcation target
        if (from.bifurcationTarget) {
          const target = engine
            .getModel()
            .getLink(from.bifurcationTarget);
          link.setBifurcationTarget(target);
          target.addBifurcation(link);
        } else if (to.bifurcationTarget) {
          const oldTarget = engine
            .getModel()
            .getLink(to.bifurcationTarget);
          link.setBifurcationTarget(null);
          oldTarget.removeBifurcation(link);
        }
      };

      engine.commands.add({
        execute: () => {
          handleLinkChanged(after, before);
        },
        undo: () => {
          handleLinkChanged(before, after);
        },
      });
    },

    /**
     * Components and links removal handler.
     */
    entitiesRemoved: ({ nodes, links }) => {
      engine.commands.add({
        execute: () => {
          // Removes all nodes
          nodes.forEach(node => node.remove());

          // Removes all links
          links.forEach(link => link.remove());
        },
        undo: () => {
          /**
           * Adds all links in the correct order. Bifurcations should be
           * added before, otherwise links on the diagram are incorretly
           * rendered.
           */
          links
            .map(link => adjustLink(link, nodes))
            .sort((l1, l2) => {
              if (
                l1.getBifurcationSource() === l2 ||
                l1.getBifurcationTarget() === l2
              )
                return 1;

              if (
                l2.getBifurcationSource() === l1 ||
                l2.getBifurcationTarget() === l1
              )
                return -1;

              return 0;
            })
            .forEach(link => engine.getModel().addLink(link));

          // Adds all nodes
          nodes.forEach(node => engine.getModel().addNode(node));
        },
      });
    },

    /**
     * Components and links move handler.
     */
    entitiesMoved: ({ nodes, links }) => {
      const handleEntitiesMoved = state => {
        // Updates all moved nodes position
        nodes[state].forEach(({ id, position }) => {
          const node = engine.getModel().getNode(id);
          node.setPosition(position.x, position.y);
        });

        // Updates all moved links points
        links[state].forEach(({ id, points }) => {
          const link = engine.getModel().getLink(id);
          link.setPoints(
            points.map(position => {
              const point = new PointModel({ link });
              point.setPosition(position);
              return point;
            }),
          );
        });
      };

      engine.commands.add({
        execute: () => {
          handleEntitiesMoved('after');
        },
        undo: () => {
          handleEntitiesMoved('before');
        },
      });
    },
  };
};

export default commandHandlers;
