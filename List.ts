class ListNode<T>
{
    m_data: T;

    m_next : ListNode<T>;
    m_prev : ListNode<T>;

    constructor ()
    {
        this.m_data = null;
        this.m_next = null;
        this.m_prev = null;
    }
}

class ListIterator<T>
{
    private m_startNode : ListNode<T>;

    constructor (list_node : ListNode<T>)
    {
        this.m_startNode = list_node;
    }

    public has_value () : Boolean
    {
        if (this.m_startNode === null)
        {
            return false;
        }

        return true;
    }

    public next ()
    {
        let result = this.m_startNode.m_data;
        this.m_startNode = this.m_startNode.m_next;
        return result;
    }
}

class List<T>
{
    private m_head : ListNode<T>;
    private m_end : ListNode<T>;
    
    private m_length : number;

    constructor ()
    {
        this.m_length = 0;

        this.m_head = null;
        this.m_end = null;
    }

    public push (value: T) : void
    {
        this.push_back(value);
    }

    public pop (): T
    {
        return this.pop_end();
    }

    public length () : number
    {
        return this.m_length;
    }

    public enumerate (func)
    {
        let iterator = this.m_head;

        while (iterator !== null)
        {
            func(iterator.m_data);
            iterator = iterator.m_next;
        }
    } 

    public GetIterator () : ListIterator<T>
    {
        return new ListIterator(this.m_head);
    }

    public remove(value: T) : void
    {
        let iter = this.m_head;
        while (iter !== null)
        {
            if (iter.m_data === value)
            {
                this.m_length--;
                if (iter.m_prev !== null)
                {
                    iter.m_prev.m_next = iter.m_next;
                }
                else
                {
                    this.m_head = iter.m_next;
                    if (this.m_head !== null)
                    {
                        this.m_head.m_prev = null;
                    }
                    return;
                }

                if (iter.m_next !== null)
                {
                    iter.m_next.m_prev = iter.m_prev;
                }
                else
                {
                    this.m_end = iter.m_prev;
                    if (this.m_end !== null)
                    {
                        this.m_end.m_next = null;
                    }
                    return;
                }
                iter.m_next = null;
                iter.m_prev = null;
                return;
            }
            iter = iter.m_next;
        }
    }

    public push_back (value: T) : void
    {
        let new_node = new ListNode<T>();
        new_node.m_data = value;

        if (this.m_head === null)
        {
            this.m_head = new_node;
            this.m_end = new_node;
            this.m_length = 1;
        }
        else
        {
            this.m_end.m_next = new_node;
            new_node.m_prev = this.m_end;
            this.m_end = new_node;

            this.m_length++;
        }
    }

    public push_front (value: T) : void
    {
        let new_node = new ListNode<T>();
        new_node.m_data = value;

        if (this.m_head === null)
        {
            this.m_head = new_node;
            this.m_end = new_node;
            this.m_length = 1;
        }
        else
        {
            this.m_head.m_prev = new_node;
            new_node.m_next = this.m_head;
            this.m_head = new_node;

            this.m_length++;
        }
    }

    public pop_front () : T
    {
        if (this.m_head === null)
        {
            return null;
        }

        let result = this.m_head.m_data;

        this.m_head = this.m_head.m_next;
        this.m_length--;
        if (this.m_head !== null)
        {
            this.m_head.m_prev.m_next = null;
            this.m_head.m_prev = null;
        }

        return result;
    }

    public pop_end () : T
    {
        if (this.m_head === null)
        {
            return null;
        }

        let result = this.m_end.m_data;

        this.m_end = this.m_end.m_prev;
        this.m_length--;
        if (this.m_end !== null)
        {
            this.m_end.m_next.m_prev = null;
            this.m_end.m_next = null;
        }

        return result;
    }
}