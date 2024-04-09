#
# Makefile
# Remove all unnessary files that should not be tracked
 
.PHONY: clean
clean:
	rm -f db.sqlite3 *.pyc
	rm -rf */*/__pycache__ */__pycache__ */*/*/__pycache__ */migrations/0*.py
	@echo "Cleanup complete."