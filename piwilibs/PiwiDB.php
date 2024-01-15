<?php
namespace PiwiLibs;

use Illuminate\Support\Facades\DB;

abstract class PiwiDB {
    protected $table;
    private $columns = [];
    private $orderBy = 'id'; 
    private $order = 'DESC';
    private $limit = null;
    private $offset = null;
    private $where = 1;
    private $binding = [];

    public function columns(array $columns) {
        $this->columns = $columns;

        return $this;
    }

    public function orderBy(string $orderBy) {
        $this->orderBy = $orderBy;

        return $this;
    }

    public function order(string $order) {
        $this->order = $order;

        return $this;
    }

    public function limit(int $limit) {
        $this->limit = $limit;

        return $this;
    }

    public function offset(int $offset) {
        $this->offset = $offset;

        return $this;
    }

    public function where(string $where, array $binding = []) {
        $this->where = $where;
        $this->binding = $binding;

        return $this;
    }

    /**
     * @return array
     */
    public function get() {
        $sql = sprintf(
            'SELECT %s from %s WHERE %s ORDER BY %s %s',
            !count($this->columns) ? '*' : implode(',', $this->columns),
            $this->table,
            $this->where,
            $this->orderBy,
            $this->order,
        );
        if ($this->limit !== null) {
            $sql .= sprintf(' LIMIT %d', $this->limit);
        }
        if ($this->offset !== null) {
            $sql .= sprintf(' OFFSET %d', $this->offset);
        }

        return DB::select($sql, $this->binding);
    }

}