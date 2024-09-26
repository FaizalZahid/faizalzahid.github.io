var labyrinthGenerator = function(rows, cols) {
    var self = this;

    var generator = new MazeGenerator(rows, cols);
    var originalGraph;

    this.graph = new Graph(rows * 2, cols * 2);

    var getCorrespondingCells = function(cell) {
        var x = cell.x * 2;
        var y = cell.y * 2;

        return {
            topLeft: self.graph.getCellAt(x, y),
            topRight: self.graph.getCellAt(x + 1, y),
            bottomLeft: self.graph.getCellAt(x, y + 1),
            bottomRight: self.graph.getCellAt(x + 1, y + 1)
        };            
    }

    var addEdges = function(cell1, cell2) {
        var cells1 = getCorrespondingCells(cell1);
        var cells2 = getCorrespondingCells(cell2);

        if ( ! originalGraph.areConnected(cell1, cell2)) {
            if (cell1.x < cell2.x) {
                self.graph.addEdgeBetween(
                    cells1.topRight,
                    cells1.bottomRight
                );
                self.graph.addEdgeBetween(
                    cells2.topLeft,
                    cells2.bottomLeft
                );
                
            } else if (cell1.x > cell2.x) {
                self.graph.addEdgeBetween(
                    cells1.topLeft,
                    cells1.bottomLeft
                );
                self.graph.addEdgeBetween(
                    cells2.topRight,
                    cells2.bottomRight
                );                            
                
            } else if (cell1.y > cell2.y) {
                self.graph.addEdgeBetween(
                    cells1.topLeft,
                    cells1.topRight
                );
                self.graph.addEdgeBetween(
                    cells2.bottomLeft,
                    cells2.bottomRight
                );                            
                
            } else if (cell1.y < cell2.y) {
                self.graph.addEdgeBetween(
                    cells1.bottomLeft,
                    cells1.bottomRight
                );
                self.graph.addEdgeBetween(
                    cells2.topLeft,
                    cells2.topRight
                );                            
                
            }
                
        } else {
            if (cell1.x < cell2.x) {
                self.graph.addEdgeBetween(
                    cells1.topRight,
                    cells2.topLeft
                );
                self.graph.addEdgeBetween(
                    cells1.bottomRight,
                    cells2.bottomLeft
                );

            } else if (cell1.x > cell2.x) {
                self.graph.addEdgeBetween(
                    cells1.topLeft,
                    cells2.topRight
                );
                self.graph.addEdgeBetween(
                    cells1.bottomLeft,
                    cells2.bottomRight
                );
                
            } else if (cell1.y > cell2.y) {
                self.graph.addEdgeBetween(
                    cells1.topLeft,
                    cells2.bottomLeft
                );
                self.graph.addEdgeBetween(
                    cells1.topRight,
                    cells2.bottomRight
                );
                
            } else if (cell1.y < cell2.y) {
                self.graph.addEdgeBetween(
                    cells1.bottomLeft,
                    cells2.topLeft
                );
                self.graph.addEdgeBetween(
                    cells1.bottomRight,
                    cells2.topRight
                );
            }
        }
    };

    this.generate = function() {
        self.graph.removeAllEdges();
        generator.generate();
        originalGraph = generator.graph;

        self.graph.addEdgeBetween(
            self.graph.getCellAt(0, 0),
            self.graph.getCellAt(1, 0)
        );

        for (var x = 0; x < rows; x++) {
            for (var y = 0; y < cols; y++) {
                var cell1 = originalGraph.getCellAt(x, y);
                var cell2 = originalGraph.getCellAt(x + 1, y);
                var cell3 = originalGraph.getCellAt(x, y + 1);
                if (cell2) {
                    addEdges(cell1, cell2);
                }
                if (cell3) {
                    addEdges(cell1, cell3);
                }
            }
        }
    };
}